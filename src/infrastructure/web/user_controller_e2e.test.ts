import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { UserEntity } from "../persistence/entities/user_entity";
import { UserService } from "../../application/services/user_service";
import { UserController } from "../web/user_controller";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let userRepository: TypeORMUserRepository;
let userService: UserService;
let userController: UserController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  userRepository = new TypeORMUserRepository(
    dataSource.getRepository(UserEntity)
  );
  userService = new UserService(userRepository);

  userController = new UserController(userService);

  app.post("/users", (req, res, next) => {
    userController.createUser(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("UserController", () => {
  it("Deve criar um usuário com sucesso", async () => {
    const response = await request(app).post("/users").send({
      name: "Amanda",
    });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User created successfully");
    expect(response.body.user.id).toBeDefined();
  });

  it("Deve retornar erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", async () => {
    const response = await request(app).post("/users").send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("O nome é obrigatório");
  });
});
