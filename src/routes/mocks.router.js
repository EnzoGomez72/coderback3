import { Router } from 'express';
import { generatePets, generateUsers } from '../utils/mocking.module.js';
import { petsService, usersService } from '../services/index.js';

const router = Router();

// Endpoint para generar 50 mascotas de prueba sin guardar
router.get('/mockingpets', (req, res) => {
  try {
    const pets = generatePets(50);
    res.status(200).send({ 
      status: "success", 
      payload: pets,
      message: "Estos son datos de prueba no persistidos"
    });
  } catch (error) {
    res.status(500).send({ 
      status: "error", 
      error: error.message,
      details: "Error al generar mascotas de prueba"
    });
  }
});

// Endpoint para generar 50 usuarios de prueba sin guardar
router.get('/mockingusers', async (req, res) => {
  try {
    const users = await generateUsers(50);
    res.status(200).send({ 
      status: "success", 
      payload: users,
      message: "Estos son datos de prueba no persistidos"
    });
  } catch (error) {
    res.status(500).send({ 
      status: "error", 
      error: error.message,
      details: "Error al generar usuarios de prueba"
    });
  }
});

// Endpoint para generar y guardar datos
router.post('/generateData', async (req, res) => {
  try {
    const { users = 0, pets = 0 } = req.body;

    // Validaciones
    if (users < 0 || pets < 0) {
      return res.status(400).send({ 
        status: "error", 
        error: "Los valores deben ser números positivos",
        details: "Valores recibidos: users=" + users + ", pets=" + pets
      });
    }

    if (users > 100 || pets > 100) {
      return res.status(400).send({ 
        status: "error", 
        error: "No se pueden generar más de 100 registros a la vez",
        details: "Límite excedido en la solicitud"
      });
    }

    const results = {};
    
    // Generar y guardar mascotas
    if (pets > 0) {
      const petsData = generatePets(pets);
      const insertedPets = await petsService.dao.createMany(petsData);
      results.pets = insertedPets;
    }

    // Generar y guardar usuarios
    if (users > 0) {
      const usersData = await generateUsers(users);
      const insertedUsers = await usersService.dao.createMany(usersData);
      results.users = insertedUsers;
    }

    res.status(201).send({ 
      status: "success", 
      message: "Datos generados y persistidos exitosamente",
      results 
    });

  } catch (error) {
    res.status(500).send({ 
      status: "error", 
      error: error.message,
      details: "Error al generar datos. Verifica que los datos generados no violen restricciones únicas (como emails)"
    });
  }
});

export default router;