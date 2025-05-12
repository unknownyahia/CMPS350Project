import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  try {
    // Clean up existing data in correct order
    await prisma.studentCourse.deleteMany();
    await prisma.prerequisite.deleteMany();
    await prisma.class.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    // Create administrator
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        username: "admin",
        password: "securepassword",
        role: "administrator",
      },
    });

    // Create 20 instructors
    const instructors = await Promise.all(
      Array.from({ length: 20 }, (_, i) => i + 1).map((i) =>
        prisma.user.create({
          data: {
            name: `Instructor ${i}`,
            username: `instructor${i}`,
            password: `instructor${i}pass`,
            role: "instructor",
          },
        })
      )
    );

    // Create 500 students in batches
    const studentBatchSize = 50;
    const students = [];
    for (let i = 0; i < 500; i += studentBatchSize) {
      const batch = Array.from({ length: studentBatchSize }, (_, j) => ({
        name: `Student ${i + j + 1}`,
        username: `student${i + j + 1}`,
        password: `student${i + j + 1}pass`,
        role: "student",
      }));
      const created = await prisma.user.createMany({ data: batch });
      students.push(
        ...(await prisma.user.findMany({
          where: { username: { in: batch.map((b) => b.username) } },
        }))
      );
    }

    // Create 50 courses in batches
    const courseBatchSize = 10;
    const courses = [];
    for (let i = 0; i < 50; i += courseBatchSize) {
      const batch = Array.from({ length: courseBatchSize }, (_, j) => ({
        name: `Course ${i + j + 1} - ${
          [
            "Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "Computer Science",
            "History",
            "Literature",
            "Economics",
            "Philosophy",
            "Art",
          ][(i + j) % 10]
        } ${100 + ((i + j) % 50)}`,
      }));
      const created = await prisma.course.createMany({ data: batch });
      courses.push(
        ...(await prisma.course.findMany({
          orderBy: { id: "desc" },
          take: courseBatchSize,
        }))
      );
    }

    // Create prerequisites (each course requires 2-3 previous courses)
    const prerequisites = [];
    for (let i = 3; i < courses.length; i++) {
      const prereqCount = Math.floor(Math.random() * 2) + 2; // 2-3 prerequisites
      const previousCourses = courses
        .slice(0, i)
        .sort(() => 0.5 - Math.random());

      for (let j = 0; j < prereqCount && j < previousCourses.length; j++) {
        prerequisites.push(
          await prisma.prerequisite.create({
            data: {
              courseId: courses[i].id,
              prerequisiteId: previousCourses[j].id,
            },
          })
        );
      }
    }

    // Create 5 classes per course with different instructors
    const classes = [];
    for (const course of courses) {
      const classCount = 5;
      const courseClasses = await Promise.all(
        Array.from({ length: classCount }).map(() =>
          prisma.class.create({
            data: {
              maxStudents: Math.floor(Math.random() * 50) + 30, // 30-80 students
              courseId: course.id,
              instructorId:
                instructors[Math.floor(Math.random() * instructors.length)].id,
            },
          })
        )
      );
      classes.push(...courseClasses);
    }

    // Enroll students in random classes (5-7 classes per student)
    const enrollmentBatchSize = 100;
    for (let i = 0; i < students.length; i += enrollmentBatchSize) {
      const studentBatch = students.slice(i, i + enrollmentBatchSize);
      const enrollments = [];

      for (const student of studentBatch) {
        const classCount = Math.floor(Math.random() * 3) + 5; // 5-7 classes
        const selectedClasses = [...classes]
          .sort(() => 0.5 - Math.random())
          .slice(0, classCount);

        for (const cls of selectedClasses) {
          const statusOptions = ["pending", "registered", "finalized"];
          const status =
            statusOptions[Math.floor(Math.random() * statusOptions.length)];

          enrollments.push(
            prisma.studentCourse.create({
              data: {
                studentId: student.id,
                classId: cls.id,
                status: status,
                grade:
                  status === "finalized"
                    ? Math.floor(Math.random() * 41) + 60 // 60-100
                    : null,
              },
            })
          );
        }
      }

      await Promise.all(enrollments);
    }

    console.log("Database seeded successfully!");
    console.log(`Created:
- 1 administrator
- ${instructors.length} instructors
- ${students.length} students
- ${courses.length} courses
- ${prerequisites.length} prerequisites
- ${classes.length} classes
- Approximately ${students.length * 6} student enrollments`);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
