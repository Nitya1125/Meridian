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
