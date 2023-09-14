export const seed = async (knex) => {
  // Delete all existing entries in the users table
  await knex("users").del();

  // Insert the admin user
  await knex("users").insert([
    {
      id: knex.raw("gen_random_uuid()"),
      email: "liran@lirantal.com",
      password: "12345678",
      name: "Liran Tal",
      role: "admin",
      picture: "https://avatars.githubusercontent.com/u/316371?v=4",
    },
  ]);
};
