**Goal:** First pass of cashier POS flow.
**Scope**
- Cart UI: add/remove items, modifiers, notes
- Payments: Cash flow stub; Stripe test mode for card/Apple Pay; “Mark as paid”
- Order queue: sequential ticket number; show current/next
- Persist orders in memory for now (or JSON file), API contract in place
**Acceptance**
- Cashier can take an order end-to-end
- Queue increments in order of submission
- Basic receipt view (order summary + total)
