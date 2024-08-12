import apiClient from './apiClient';

const eventEndpoint = '/events';

export const getAllEvents = async () => {
  const response = await apiClient.get(eventEndpoint);
  return response?.data;
};

export const getEventById = async (id: string) => {
  const response = await apiClient.get(`${eventEndpoint}/${id}`);
  return response?.data;
};

export const createEvent = async (data: unknown) => {
  const response = await apiClient.post(eventEndpoint, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response?.data;
};

export const updateEvent = async (data: { id: string }) => {
  const response = await apiClient.put(`${eventEndpoint}/${data.id}`, data);
  return response?.data;
};

export const deleteEventById = async (id: string) => {
  const response = await apiClient.delete(`${eventEndpoint}/${id}`);
  return response?.data;
};

const participantEndpoint = '/participants';

export const getAllParticipants = async () => {
  const response = await apiClient.get(participantEndpoint);
  return response?.data;
};

export const getParticipantById = async (id: string) => {
  const response = await apiClient.get(`${participantEndpoint}/${id}`);
  return response?.data;
};

export const createParticipant = async (data: unknown) => {
  const response = await apiClient.post(participantEndpoint, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response?.data;
};

export const updateParticipant = async (data: { id: string }) => {
  const response = await apiClient.put(
    `${participantEndpoint}/${data.id}`,
    data
  );
  return response?.data;
};

export const deleteParticipantById = async (id: string) => {
  const response = await apiClient.delete(`${participantEndpoint}/${id}`);
  return response?.data;
};

export const getParticipantFamilyMembers = async (id: string) => {
  const response = await apiClient.get(
    `${participantEndpoint}/${id}/family-members`
  );
  return response?.data;
};

const emergencyContactEndpoint = '/emergency-contacts';

export const getAllEmergencyContacts = async () => {
  const response = await apiClient.get(emergencyContactEndpoint);
  return response?.data;
};

export const getEmergencyContactById = async (id: string) => {
  const response = await apiClient.get(`${emergencyContactEndpoint}/${id}`);
  return response?.data;
};

export const createEmergencyContact = async (data: unknown) => {
  const response = await apiClient.post(emergencyContactEndpoint, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response?.data;
};

export const updateEmergencyContact = async (data: { id: string }) => {
  const response = await apiClient.put(
    `${emergencyContactEndpoint}/${data.id}`,
    data
  );
  return response?.data;
};

export const deleteEmergencyContactById = async (id: string) => {
  const response = await apiClient.delete(`${emergencyContactEndpoint}/${id}`);
  return response?.data;
};
