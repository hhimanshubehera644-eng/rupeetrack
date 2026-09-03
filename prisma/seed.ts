import { PrismaClient, TaxRegime } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "bhabani@rupeetrack.local" },
    update: { name: "Bhabani", defaultTaxRegime: TaxRegime.NEW },
    create: { email: "bhabani@rupeetrack.local", name: "Bhabani", defaultTaxRegime: TaxRegime.NEW },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
