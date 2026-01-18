---
name: app-manifest
description: This is a new rule
alwaysApply: true
---

# Overview

This project is a web-based incremental game based of the idea of pokemon combat and exploration.

# Projected Features 
The project is still on a protype level; not all the features are impemented. This list represents a design goal.

- hex-based map exploration with semi-procedural generation
- creature collection, battling, capture and training
- team management
- incremental progression
- basic quests
- auto combat with customisable setup

# Structure and principles 

## src/app

Contains the main application with the minimal orchestration features.

## src/features

Contains the core of the game

### engine

Containes the logic, purely based on a TS main engine

### ui

Containes the ui rendering, based on REACT for interactive elements, and canvas for complex display like the map.

### store

Contains the logic bridge between ui and engine

## src/common

Containes shared interfaces, utilities, hooks and atomic components.

# Coding guidelines

- Follow react's best practices and SOLID principles
- Each component should be contained
- Logic belongs to the engine, rendering belong to ui - they shouldn't be mixed and allowed to function without one another
- Focus on project scalabity and maintainability
