```markdown
Prisma merge suggestions (merge into your existing prisma/schema.prisma)

If you already have a schema.prisma, append the following model definitions (or merge their fields into your existing models).
Do NOT replace your whole schema file — merge these models into the existing file.

Suggested snippet to add:

model Tag {
  id    Int       @id @default(autoincrement())
  name  String    @unique
  notes NoteTag[]
}

model NoteTag {
  noteId Int
  tagId  Int
  note   Note @relation(fields: [noteId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([noteId, tagId])
}

model Favorite {
  id        Int      @id @default(autoincrement())
  note      Note     @relation(fields: [noteId], references: [id], onDelete: Cascade)
  noteId    Int
  userId    String?
  createdAt DateTime @default(now())

  @@unique([noteId, userId])
}

model ShareLink {
  id        Int      @id @default(autoincrement())
  note      Note     @relation(fields: [noteId], references: [id], onDelete: Cascade)
  noteId    Int
  token     String   @unique
  expiresAt DateTime?
  createdAt DateTime @default(now())
}

model Version {
  id        Int      @id @default(autoincrement())
  note      Note     @relation(fields: [noteId], references: [id], onDelete: Cascade)
  noteId    Int
  title     String
  content   String?
  createdAt DateTime @default(now())
}

Notes:
- After merging, run:
  npx prisma generate
  npx prisma migrate dev --name add_phase_a

- Backup your DB before running migrations if you have production data.
```
