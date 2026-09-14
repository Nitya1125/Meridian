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