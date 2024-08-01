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
  pgm.createTable('follows', {
    follower_id: {
      type: 'VARCHAR(255)',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    following_id: {
      type: 'VARCHAR(255)',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('follows', 'fk_follows_follower_id', {
    foreignKeys: {
      columns: 'follower_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('follows', 'fk_follows_following_id', {
    foreignKeys: {
      columns: 'following_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint('follows', 'follows_pkey', {
    primaryKey: ['follower_id', 'following_id'],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('follows');
};
