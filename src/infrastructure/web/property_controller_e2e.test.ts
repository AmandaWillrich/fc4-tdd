import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { PropertyService } from "../../application/services/property_service";
import { PropertyController } from "../web/property_controller";
import { TypeORMPropertyRepository } from "../../infrastructure/repositories/typeorm_property_repository";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [PropertyEntity, BookingEntity, UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );
  propertyService = new PropertyService(propertyRepository);
  propertyController = new PropertyController(propertyService);

  app.post("/properties", (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("PropertyController", () => {
  it("Deve criar uma propriedade com sucesso", async () => {
    const response = await request(app).post("/properties").send({
      name: "Propriedade Qualquer",
      description: "Alguma propriedade qualquer",
      maxGuests: 3,
      basePricePerNight: 200,
    });
    expect(response.status).toBe(201);
    expect(response.body.property).toHaveProperty("id");
    expect(response.body.property).toHaveProperty("description");
    expect(response.body.property).toHaveProperty("maxGuests");
    expect(response.body.property).toHaveProperty("basePricePerNight");
  });

  it("Deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post("/properties").send({
      description: "Alguma propriedade qualquer",
      maxGuests: 3,
      basePricePerNight: 200,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O nome da propriedade é obrigatório");
  });

  it("Deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
    const response = await request(app).post("/properties").send({
      name: "Propriedade Qualquer",
      description: "Alguma propriedade qualquer",
      maxGuests: 0,
      basePricePerNight: 200,
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "A capacidade máxima deve ser maior que zero"
    );
  });

  it("Deve retornar erro com código 400 e mensagem 'O preço base por noite é obrigatório.' ao enviar basePricePerNight ausente", async () => {
    const response = await request(app).post("/properties").send({
      name: "Propriedade Qualquer",
      description: "Alguma propriedade qualquer",
      maxGuests: 3
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("'O preço base por noite é obrigatório");
  });
});
