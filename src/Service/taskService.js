export async function addTask(data) {
    const response = await fetch("/api/tasks/add_task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to add task");
    }

    return result;
}

export async function getTasks(data){
    const orgId = typeof data === 'object' && data !== null ? data.organization_id : data;
    const response = await fetch(`/api/tasks?organization_id=${orgId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to get tasks");
    }

    return result;
}

export async function updateTask(data){
    const response = await fetch("/api/tasks/update_task", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to update task");
    }

    return result;
}

export async function deleteTask(data){
    const payload = typeof data === 'object' && data !== null ? data : { task_id: data };
    const response = await fetch("/api/tasks/delete_task", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to delete task");
    }

    return result;
}

// ── Subtask Service Functions ────────────────────────────────────

export async function addSubtask(data){
    const response = await fetch("/api/tasks/subtask/add_subtask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to add subtask");
    }

    return result;
}

export async function getSubtasks(task_id){
    const response = await fetch(`/api/tasks/subtask?task_id=${task_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to get subtasks");
    }

    return result;
}

// PATCH /api/tasks/subtask/update_subtask?subtask_id={id}
// Backend toggles is_completed, takes subtask_id as query param
export async function updateSubtask(subtask_id){
    const response = await fetch(`/api/tasks/subtask/update_subtask?subtask_id=${subtask_id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to update subtask");
    }

    return result;
}

// DELETE /api/tasks/subtask/delete_subtask
// Backend expects body: { subtaskId } (camelCase)
export async function deleteSubtask(data){
    const payload = typeof data === 'object' && data !== null ? data : { subtaskId: data };
    const response = await fetch("/api/tasks/subtask/delete_subtask", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to delete subtask");
    }

    return result;
}

// ── Comment Service Functions ────────────────────────────────────

export async function getTaskComments(task_id){
    const response = await fetch(`/api/tasks/comments?task_id=${task_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to get comments");
    }

    return result;
}

export async function addTaskComment(data){
    const response = await fetch("/api/tasks/comments/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to add comment");
    }

    return result;
}

export async function editTaskComment(data){
    const response = await fetch("/api/tasks/comments/edit", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to edit comment");
    }

    return result;
}

export async function deleteTaskComment(data){
    const payload = typeof data === 'object' && data !== null ? data : { comment_id: data };
    const response = await fetch("/api/tasks/comments/delete", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Failed to delete comment");
    }

    return result;
}