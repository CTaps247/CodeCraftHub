const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_FILE = "./courses.json";

app.use(cors());
app.use(express.json());

// Read courses
function readCourses() {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
}

// Save courses
function saveCourses(courses) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(courses, null, 2));
}

// GET all courses
app.get("/api/courses", (req, res) => {
    res.json(readCourses());
});

// GET one course
app.get("/api/courses/:id", (req, res) => {
    const courses = readCourses();
    const course = courses.find(c => c.id == req.params.id);

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
});

// POST new course
app.post("/api/courses", (req, res) => {

    const { title, instructor, status } = req.body;

    if (!title || !instructor || !status) {
        return res.status(400).json({
            message: "title, instructor and status are required"
        });
    }

    const courses = readCourses();

    const newCourse = {
        id: Date.now(),
        title,
        instructor,
        status
    };

    courses.push(newCourse);
    saveCourses(courses);

    res.status(201).json(newCourse);
});

// PUT update course
app.put("/api/courses/:id", (req, res) => {

    const courses = readCourses();

    const index = courses.findIndex(c => c.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({
            message: "Course not found"
        });
    }

    courses[index] = {
        ...courses[index],
        ...req.body
    };

    saveCourses(courses);

    res.json(courses[index]);
});

// DELETE course
app.delete("/api/courses/:id", (req, res) => {

    const courses = readCourses();

    const filtered = courses.filter(c => c.id != req.params.id);

    if (filtered.length === courses.length) {
        return res.status(404).json({
            message: "Course not found"
        });
    }

    saveCourses(filtered);

    res.json({
        message: "Course deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});