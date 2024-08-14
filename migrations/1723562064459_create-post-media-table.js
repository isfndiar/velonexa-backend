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
  pgm.createType('type_media', ['video', 'image']);
  pgm.createTable('media_posts', {
    id: { type: 'VARCHAR(255)', notNull: true, primaryKey: true },
    post_id: {
      type: 'VARCHAR(255)',
      notNull: true,
      references: 'posts',
      onDelete: 'CASCADE',
    },
    url: { type: 'VARCHAR(300)', notNull: true },
    type: { type: 'type_media', notNull: true },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('media_posts', 'fk_media_posts_posts_id', {
    foreignKeys: {
      columns: 'post_id',
      references: 'posts(id)',
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
  pgm.dropTable('media_posts');
  pgm.dropType('type_media');
};
