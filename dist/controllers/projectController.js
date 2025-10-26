"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.getOngoingProjects = exports.markProjectAsOngoing = exports.getCompletedProjects = exports.markProjectAsCompleted = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const project_1 = __importDefault(require("../models/project"));
// Create new project
const createProject = async (req, res) => {
    try {
        const { title, description, tools, category } = req.body;
        const project = new project_1.default({ title, description, tools, category, status: "opened" });
        const exixtingProject = await project_1.default.findOne({ title });
        if (exixtingProject) {
            return res.status(400).json({ message: "Project with this title already exists" });
        }
        await project.save();
        res.status(201).json({ message: "Project created successfully", project });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to create project", error: error.message });
    }
};
exports.createProject = createProject;
// Get all projects
const getProjects = async (req, res) => {
    try {
        const projects = await project_1.default.find().populate("title description category tools").lean().sort({ createdAt: -1 });
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch projects", error: error.message });
    }
};
exports.getProjects = getProjects;
// Get project by ID
const getProjectById = async (req, res) => {
    try {
        const project = await project_1.default.findById(req.params.id).populate("title description category tools");
        if (!project)
            return res.status(404).json({ message: "Project not found" });
        res.status(200).json(project);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch project", error: error.message });
    }
};
exports.getProjectById = getProjectById;
// Update project
const updateProject = async (req, res) => {
    try {
        const project = await project_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project)
            return res.status(404).json({ message: "Project not found" });
        if (project.status === "completed") {
            return res.status(400).json({ message: "Cannot update a completed project" });
        }
        res.status(200).json({ message: "Project updated successfully", project });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update project", error: error.message });
    }
};
exports.updateProject = updateProject;
const markProjectAsCompleted = async (req, res) => {
    try {
        const project = await project_1.default.findById(req.params.id);
        if (!project)
            return res.status(404).json({ message: "Project not found" });
        project.status = "completed";
        await project.save();
        res.status(200).json({ message: "Project marked as completed", project });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to mark project as completed", error: error.message });
    }
};
exports.markProjectAsCompleted = markProjectAsCompleted;
const getCompletedProjects = async (req, res) => {
    try {
        const projects = await project_1.default.find({ status: "completed" }).populate("title description category tools").lean().sort({ createdAt: -1 });
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch completed projects", error: error.message });
    }
};
exports.getCompletedProjects = getCompletedProjects;
const markProjectAsOngoing = async (req, res) => {
    try {
        const project = await project_1.default.findById(req.params.id);
        if (!project)
            return res.status(404).json({ message: "Project not found" });
        project.status = "ongoing";
        await project.save();
        res.status(200).json({ message: "Project marked as ongoing", project });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to mark project as ongoing", error: error.message });
    }
};
exports.markProjectAsOngoing = markProjectAsOngoing;
const getOngoingProjects = async (req, res) => {
    try {
        const projects = await project_1.default.find({ status: "ongoing" }).populate("title description category tools").lean().sort({ createdAt: -1 });
        res.status(200).json(projects);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch ongoing projects", error: error.message });
    }
};
exports.getOngoingProjects = getOngoingProjects;
// Delete project
const deleteProject = async (req, res) => {
    try {
        const project = await project_1.default.findByIdAndDelete(req.params.id);
        if (!project)
            return res.status(404).json({ message: "Project not found" });
        res.status(200).json({ message: "Project deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to delete project", error: error.message });
    }
};
exports.deleteProject = deleteProject;
