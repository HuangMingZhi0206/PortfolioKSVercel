import 'dotenv/config';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDatabase, dbExec, dbRun } from '../config/database.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const importData = async () => {
    try {
        const sqlPath = path.join(__dirname, '..', '..', 'portfolio_db.sql')

        if (!fs.existsSync(sqlPath)) {
            console.error('âŒ SQL dump file not found at:', sqlPath)
            return
        }

        console.log('ðŸ“– Reading SQL dump file...')
        const sqlContent = fs.readFileSync(sqlPath, 'utf8')

        console.log('ðŸ”„ Initializing database...')
        await initDatabase()

        // Extract INSERT statements
        const lines = sqlContent.split('\n')
        let count = 0

        console.log('ðŸš€ Starting import...')

        // Clear existing data first
        const tables = [
            'project_technologies', 'project_media', 'projects',
            'experience_skills', 'experience_media', 'experience_highlights', 'experiences',
            'certification_skills', 'certification_media', 'certifications',
            'skills', 'education', 'contact_messages', 'about_me', 'admin_users'
        ]

        console.log('ðŸ§¹ Clearing existing data...')
        for (const table of tables) {
            try {
                dbExec(`DELETE FROM ${table};`)
                dbExec(`DELETE FROM sqlite_sequence WHERE name='${table}';`)
            } catch (e) {
                // Ignore if table doesn't exist
            }
        }

        let insertBuffer = ''
        let inInsert = false

        for (const line of lines) {
            const trimmed = line.trim()

            if (trimmed.startsWith('INSERT INTO')) {
                inInsert = true
                insertBuffer = trimmed
            } else if (inInsert) {
                insertBuffer += ' ' + trimmed
            }

            if (inInsert && trimmed.endsWith(';')) {
                let statement = insertBuffer

                // Remove backticks
                statement = statement.replace(/`/g, '')

                try {
                    dbExec(statement)
                    process.stdout.write('.')
                    count++
                } catch (err) {
                    console.error(`\nâŒ Error executing statement: ${statement.substring(0, 50)}...`)
                    console.error(err.message)
                }

                inInsert = false
                insertBuffer = ''
            }
        }

        console.log(`\n\nâœ… Import completed! Imported ${count} records.`)

    } catch (error) {
        console.error('Fatal error:', error)
    }
}

importData()


