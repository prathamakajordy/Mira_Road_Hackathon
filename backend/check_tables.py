import sqlite3

conn = sqlite3.connect("preventiq.db")
cursor = conn.cursor()

tables = cursor.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
print("Tables in DB:", tables)
