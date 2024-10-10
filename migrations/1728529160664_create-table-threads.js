exports.up = (pgm) => {
  pgm.createTable("threads", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    title: {
      type: "TEXT",
      notNull: true,
    },
    body: {
      type: "TEXT",
      notNull: true,
    },
    date: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint(
    "threads",
    "fk_thread.user.id",
    `FOREIGN KEY("owner") REFERENCES users(id) ON DELETE CASCADE`
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("threads", "fk_thread.user.id");
  pgm.dropTable("threads");
};
