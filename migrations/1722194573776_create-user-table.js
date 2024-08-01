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
  pgm.createType('gender', ['male', 'female']);
  pgm.createType('type_login', ['credential', 'google']);
  pgm.createTable('users', {
    id: { type: 'VARCHAR(255)', notNull: true, primaryKey: true },
    username: {
      type: 'VARCHAR(20)',
      check: 'char_length(username) >= 4',
      notNull: true,
      unique: true,
    },
    name: { type: 'VARCHAR(255)' },
    bio: { type: 'VARCHAR(255)' },
    email: { type: 'VARCHAR(255)', notNull: true, unique: true },
    password: { type: 'VARCHAR(255)', notNull: true },
    type: { type: 'type_login', default: 'credential' },
    verify: { type: 'BOOLEAN', notNull: false, default: false },
    gender: { type: 'gender', notNull: false },
    profile_image: { type: 'VARCHAR(300)' },
    phone_number: { type: 'VARCHAR(25)', unique: true },
    is_private: { type: 'BOOLEAN', notNull: true, default: false },
    is_new_user: { type: 'BOOLEAN', notNull: true, default: false },
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
  pgm.createIndex('users', 'username');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropIndex('users', 'username');
  pgm.dropTable('users');
  pgm.dropType('gender');
  pgm.dropType('type_login');
};
