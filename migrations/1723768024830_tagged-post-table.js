/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('tagged_posts', {
    post_id: {
      type: 'VARCHAR(255)',
      notNull: true,
      references: 'posts',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'VARCHAR(255)',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
  });
  pgm.addConstraint('tagged_posts', 'unique_tagged_posts', {
    unique: ['post_id', 'user_id'],
  });
  pgm.addConstraint('tagged_posts', 'fk_tagged_posts_post_id', {
    foreignKeys: {
      columns: 'post_id',
      references: 'posts(id)',
      onDelete: 'CASCADE',
    },
  });
  pgm.addConstraint('tagged_posts', 'fk_tagged_posts_user_id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('tagged_posts', 'unique_tagged_posts');
  pgm.dropTable('tagged_posts');
};
