from prisma import Prisma as prisma

prisma = prisma()

def connect_db():
    prisma.connect()