import path from 'node:path'
import { sql } from '@/libs/db'
import { Umzug } from 'umzug'

export const migrator = new Umzug({
  migrations: {
    glob: ['migrations/*.sql', { cwd: __dirname }],
    resolve(params) {
      const downPath = path.join(
        path.dirname(params.path!),
        'down',
        path.basename(params.path!),
      )

      return {
        name: params.name,
        path: params.path,
        up: async () => sql.file(params.path!),
        down: async () => sql.file(downPath),
      }
    },
  },
  storage: {
    async executed() {
      await sql`
        CREATE TABLE IF NOT EXISTS migrations_logs (
          name TEXT PRIMARY KEY
        )
      `

      const results = await sql<{ name: string }[]>`
        SELECT name FROM migrations_logs
      `

      return results.map((r) => r.name)
    },
    async logMigration({ name }) {
      await sql`
        INSERT INTO migrations_logs (name) VALUES (${name})
      `
    },
    async unlogMigration({ name }) {
      await sql`
        DELETE FROM migrations_logs WHERE name = ${name}
      `
    },
  },
  logger: console,
  create: {
    folder: path.join(__dirname, 'migrations'),
  },
})

export const seeder = new Umzug({
  migrations: {
    glob: ['seeders/*.sql', { cwd: __dirname }],
    resolve(params) {
      const downPath = path.join(
        path.dirname(params.path!),
        'down',
        path.basename(params.path!),
      )

      return {
        name: params.name,
        path: params.path,
        up: async () => sql.file(params.path!),
        down: async () => sql.file(downPath),
      }
    },
  },
  storage: {
    async executed() {
      await sql`
        CREATE TABLE IF NOT EXISTS seeders_logs (
          name TEXT PRIMARY KEY
        )
      `

      const results = await sql<{ name: string }[]>`
        SELECT name FROM seeders_logs
      `

      return results.map((r) => r.name)
    },
    async logMigration({ name }) {
      await sql`
        INSERT INTO seeders_logs (name) VALUES (${name})
      `
    },
    async unlogMigration({ name }) {
      await sql`
        DELETE FROM seeders_logs WHERE name = ${name}
      `
    },
  },
  logger: console,
  create: {
    folder: path.join(__dirname, 'seeders'),
  },
})

migrator.on('afterCommand', async () => {
  await sql.end()
})

seeder.on('afterCommand', async () => {
  await sql.end()
})

export type Migration = typeof migrator._types.migration
export type Seeder = typeof seeder._types.migration
