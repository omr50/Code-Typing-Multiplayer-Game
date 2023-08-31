import psycopg2
import csv

# Setup PostgreSQL connection
conn = psycopg2.connect(
    dbname="CODE_TYPER_DB",
    user="postgres",
    password="postgres",
    host="localhost",  # or your docker machine's IP
    port="5432"
)

# Create a cursor object
cur = conn.cursor()

# The path to the CSV file
csv_file_path = "D:/Code_Typing_Game/data/snippet_data.csv"

# Open the CSV file and read each row
with open(csv_file_path, 'r', newline='', encoding='utf-8') as csvfile:
    csvreader = csv.reader(csvfile)

    # Skip the header row
    next(csvreader)

    for row in csvreader:
        # Assuming the CSV has three columns: id, language, code
        snippet_id, language, code = row

        # Insert data into the `snippets` table
        insert_sql = """INSERT INTO snippets (id, language, code) VALUES (%s, %s, %s)"""
        cur.execute(insert_sql, (snippet_id, language, code))

# Commit changes
conn.commit()

# Close cursor and connection
cur.close()
conn.close()
