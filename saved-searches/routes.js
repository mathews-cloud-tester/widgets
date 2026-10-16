export function savedSearchRoutes(router, db) {
  router.get("/api/saved-searches", async (req, res) => {
    res.json(await db.query("SELECT id, name, query FROM saved_searches WHERE user_id = $1 ORDER BY created_at", [req.user.id]));
  });
  router.post("/api/saved-searches", async (req, res) => {
    const { name, query } = req.body;
    res.status(201).json(await db.one("INSERT INTO saved_searches (user_id, name, query) VALUES ($1, $2, $3) RETURNING id, name, query", [req.user.id, name, query]));
  });
  router.delete("/api/saved-searches/:id", async (req, res) => {
    await db.query("DELETE FROM saved_searches WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
    res.status(204).end();
  });
}
