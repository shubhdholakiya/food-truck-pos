import "dotenv/config";
import { db } from "../db";
import { categories, menuItems, modifierGroups, modifiers, itemModifierGroups } from "@shared/schema";

async function main() {
  const [burgers] = await db.insert(categories).values({ name: "Burgers", sort: 1 }).returning();
  const [addons]  = await db.insert(modifierGroups).values({ name: "Add-ons", min: 0, max: 3 }).returning();

  // after creating the group:
await db.insert(modifiers).values([
  { groupId: addons.id, name: "Cheese", priceDelta: "0.50", sortOrder: 1, isActive: true },
  { groupId: addons.id, name: "Bacon",  priceDelta: "1.00", sortOrder: 2, isActive: true },
]);

const [classic] = await db.insert(menuItems).values({
  categoryId: burgers.id,
  name: "Classic Burger",
  price: "7.99",      // decimal → send as string
  sortOrder: 1
}).returning();


  await db.insert(itemModifierGroups).values({ itemId: classic.id, groupId: addons.id });

  console.log("Seeded basic menu 👍");
}
main().then(()=>process.exit(0)).catch(err=>{console.error(err);process.exit(1);});
