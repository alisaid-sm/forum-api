exports.up = (pgm) => {
  pgm.createTable("likes", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    comment: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    date: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    is_delete: {
      type: "BOOLEAN",
      default: false,
    },
  });

  pgm.addConstraint(
    "likes",
    "fk_like.comment.id",
    `FOREIGN KEY("comment") REFERENCES comments(id) ON DELETE CASCADE`
  );
  pgm.addConstraint(
    "likes",
    "fk_like.user.id",
    `FOREIGN KEY("owner") REFERENCES users(id) ON DELETE CASCADE`
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("likes", "fk_like.comment.id");
  pgm.dropConstraint("likes", "fk_like.user.id");
  pgm.dropTable("likes");
};
