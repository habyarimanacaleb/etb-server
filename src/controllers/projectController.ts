import { Request, Response } from "express";
import Project from "../models/project";

// Create new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, tools,category } = req.body;
    const project = new Project({ title, description, tools,category, status: "opened"});

    const exixtingProject = await Project.findOne({ title });
    if (exixtingProject) {
      return res.status(400).json({ message: "Project with this title already exists" });
    }

    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to create project", error: error.message });
  }
};

// Get all projects
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().populate("title description category tools").lean().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch projects", error: error.message });
  }
};

// Get project by ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).populate("title description category tools");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch project", error: error.message });
  }
};

// Update project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: "Project not found" });

    if(project.status==="completed"){
      return res.status(400).json({ message: "Cannot update a completed project" });
    }
    
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to update project", error: error.message });
  }
};

export const markProjectAsCompleted = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    project.status = "completed";
    await project.save();
    res.status(200).json({ message: "Project marked as completed", project });
  }
  catch (error: any) {
    res.status(500).json({ message: "Failed to mark project as completed", error: error.message });
  }
};
export const getCompletedProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ status: "completed" }).populate("title description category tools").lean().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch completed projects", error: error.message });
  }
};

export const markProjectAsOngoing = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    project.status = "ongoing";
    await project.save();
    res.status(200).json({ message: "Project marked as ongoing", project });
  }
  catch (error: any) {
    res.status(500).json({ message: "Failed to mark project as ongoing", error: error.message });
  }
};

export const getOngoingProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({ status: "ongoing" }).populate("title description category tools").lean().sort({ createdAt: -1 }); 
    res.status(200).json(projects);
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch ongoing projects", error: error.message });
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Failed to delete project", error: error.message });
  }
};
