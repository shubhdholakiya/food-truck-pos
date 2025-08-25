import { Router } from "express";
import { db } from "./db";
import {
  categories, menuItems,
  modifierGroups, modifiers, itemModifierGroups,
  insertCategorySchema, insertMenuItemSchema,
  insertModifierGroupSchema, insertModifierSchema,
} from "../shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const r = Router();
r.get("/_ping", (_req, res) => res.json({ ok: true, where: "menu" }));

/* --------- Categories --------- */
r.get("/categories", async (_req, res) => {
  const rows = await db.select().from(categories).orderBy(categories.sortOrder);
  res.json(rows);
});

r.post("/categories", async (req, res) => {
  const body = insertCategorySchema.partial().parse(req.body);
  const [row] = await db.insert(categories).values(body).returning();
  res.status(201).json(row);
});

r.put("/categories/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const body = insertCategorySchema.partial().parse(req.body);
  const [row] = await db.update(categories).set(body).where(eq(categories.id, id)).returning();
  res.json(row);
});

r.delete("/categories/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  await db.delete(categories).where(eq(categories.id, id));
  res.sendStatus(204);
});

/* --------- Items --------- */
r.get("/items", async (req, res) => {
  const cid = req.query.categoryId ? String(req.query.categoryId) : undefined;
  const rows = await db.select().from(menuItems)
    .where(cid ? eq(menuItems.categoryId, cid) : undefined)
    .orderBy(menuItems.sortOrder);
  res.json(rows);
});

r.post("/items", async (req, res) => {
  const body = insertMenuItemSchema.extend({
    modifierGroupIds: z.array(z.string().uuid()).optional(),
  }).parse(req.body);

  const { modifierGroupIds, ...item } = body;
  const [row] = await db.insert(menuItems).values(item).returning();

  if (modifierGroupIds?.length) {
    await db.insert(itemModifierGroups).values(
      modifierGroupIds.map(gid => ({ itemId: row.id, groupId: gid }))
    );
  }
  res.status(201).json(row);
});

r.put("/items/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const body = insertMenuItemSchema.partial().extend({
    modifierGroupIds: z.array(z.string().uuid()).optional(),
  }).parse(req.body);

  const { modifierGroupIds, ...itemPatch } = body;
  const [row] = await db.update(menuItems).set(itemPatch).where(eq(menuItems.id, id)).returning();

  if (modifierGroupIds) {
    await db.delete(itemModifierGroups).where(eq(itemModifierGroups.itemId, id));
    if (modifierGroupIds.length) {
      await db.insert(itemModifierGroups).values(
        modifierGroupIds.map(gid => ({ itemId: id, groupId: gid }))
      );
    }
  }
  res.json(row);
});

r.delete("/items/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  await db.delete(itemModifierGroups).where(eq(itemModifierGroups.itemId, id));
  await db.delete(menuItems).where(eq(menuItems.id, id));
  res.sendStatus(204);
});

/* --------- Modifier Groups --------- */
r.get("/modifier-groups", async (_req, res) => {
  const rows = await db.select().from(modifierGroups).orderBy(modifierGroups.sortOrder);
  res.json(rows);
});

r.post("/modifier-groups", async (req, res) => {
  const body = insertModifierGroupSchema.parse(req.body);
  const [row] = await db.insert(modifierGroups).values(body).returning();
  res.status(201).json(row);
});

r.put("/modifier-groups/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const body = insertModifierGroupSchema.partial().parse(req.body);
  const [row] = await db.update(modifierGroups).set(body).where(eq(modifierGroups.id, id)).returning();
  res.json(row);
});

r.delete("/modifier-groups/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  await db.delete(modifierGroups).where(eq(modifierGroups.id, id));
  res.sendStatus(204);
});

/* --------- Modifiers --------- */
r.get("/modifiers", async (req, res) => {
  const gid = req.query.groupId ? String(req.query.groupId) : undefined;
  const rows = await db.select().from(modifiers)
    .where(gid ? eq(modifiers.groupId, gid) : undefined)
    .orderBy(modifiers.sortOrder);
  res.json(rows);
});

r.post("/modifiers", async (req, res) => {
  const body = insertModifierSchema.parse(req.body);
  const [row] = await db.insert(modifiers).values(body).returning();
  res.status(201).json(row);
});

r.put("/modifiers/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  const body = insertModifierSchema.partial().parse(req.body);
  const [row] = await db.update(modifiers).set(body).where(eq(modifiers.id, id)).returning();
  res.json(row);
});

r.delete("/modifiers/:id", async (req, res) => {
  const { id } = z.object({ id: z.string().uuid() }).parse(req.params);
  await db.delete(modifiers).where(eq(modifiers.id, id));
  res.sendStatus(204);
});

export default r;
