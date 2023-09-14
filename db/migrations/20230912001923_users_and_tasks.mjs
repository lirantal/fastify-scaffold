export const up = async (knex) => {
  return knex.schema
    .createTable("users", function (table) {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.string("email").unique();
      table.string("password").notNullable();
      table.string("name");
      table.string("role").notNullable().defaultTo("user");
      table.string("picture");
      table.timestamps(true, true);
    })
    .createTable("tasks", function (table) {
      table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
      table.uuid("user_id").notNullable();
      table.string("name").notNullable();
      table.boolean("completed").defaultTo(false);
      table.jsonb("tags");
      table.timestamps(true, true);

      table.foreign("user_id").references("users.id");
    });
};

export const down = async (knex) => {
  return knex.schema.dropTable("users").dropTable("tasks");
};
