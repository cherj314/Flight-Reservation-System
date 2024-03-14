import { useState, useEffect } from 'react';

export function useEntityManagement(apiConfig) {
    const [entities, setEntities] = useState([]);
    const [newEntity, setNewEntity] = useState({}); // Initialize newEntity based on the entity shape

    const fetchEntities = async () => {
        try {
            const response = await fetch(apiConfig.fetchUrl);
            const data = await response.json();
            setEntities(data);
        } catch (error) {
            console.error(`Error fetching ${apiConfig.entityName}:`, error);
        }
    };

    const addEntity = async () => {
        try {
            await fetch(apiConfig.addUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEntity),
            });
            setNewEntity({}); // Reset newEntity based on the entity shape
            fetchEntities();
        } catch (error) {
            console.error(`Error adding ${apiConfig.entityName}:`, error);
        }
    };

    const removeEntity = async (entityId) => {
        try {
            const response = await fetch(`${apiConfig.removeUrl}/${entityId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                const updatedEntities = entities.filter((entity) => entity[apiConfig.idField] !== entityId);
                setEntities(updatedEntities);
            } else {
                console.error(`Error removing ${apiConfig.entityName}:`, response.statusText);
            }
        } catch (error) {
            console.error(`Error removing ${apiConfig.entityName}:`, error);
        }
    };

    useEffect(() => {
        fetchEntities();
    }, []);

    return {
        entities,
        fetchEntities,
        setEntities,
        newEntity,
        setNewEntity,
        addEntity,
        removeEntity
    };
}
