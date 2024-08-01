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
  pgm.createTable('posts', {
    id: { type: 'VARCHAR(255)', notNull: true, primaryKey: true },
    user_id: {
      type: 'VARCHAR(255)',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    description: { type: 'VARCHAR(255)' },
    location: { type: 'VARCHAR(255)' },
    comment_disable: { type: 'BOOLEAN', notNull: true, default: false },
    archive: { type: 'BOOLEAN', notNull: true, default: false },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.addConstraint('posts', 'fk_posts_user_id', {
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
  pgm.dropTable('posts');
};
