
exports.up = function(knex, Promise) {
	return knex.schema.createTable('blades', function(t) {
		t.increments('id').unsigned().primary();
		t.dateTime('createdAt').notNull();
        t.dateTime('updatedAt').nullable();
        t.dateTime('deletedAt').nullable();

        t.string('stensNumber').notNull();
        t.integer('quantity').notNull();
	})
  
};

exports.down = function(knex, Promise) {
  	return knex.schema.dropTable('blades');
};