import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "../mappers/property_mapper";

describe("Property Mapper", () => {
  it("Deve converter PropertyEntity em Property corretamente", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Casa de Campo";
    propertyEntity.description = "Linda casa de Campo para passear";
    propertyEntity.maxGuests = 6;
    propertyEntity.basePricePerNight = 300;

    const property = PropertyMapper.toDomain(propertyEntity);

    expect(property).toBeInstanceOf(Property);
    expect(property.getId()).toBe("1");
    expect(property.getName()).toBe("Casa de Campo");
    expect(property.getDescription()).toBe("Linda casa de Campo para passear");
    expect(property.getMaxGuests()).toBe(6);
    expect(property.getBasePricePerNight()).toBe(300);
  });

  it("Deve lançar erro de validação ao faltar campo nome no PropertyEntity", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.description = "Linda casa de Campo para passear";
    propertyEntity.maxGuests = 5;
    propertyEntity.basePricePerNight = 300;

    expect(() => {
      PropertyMapper.toDomain(propertyEntity);
    }).toThrow("O nome é obrigatório");
  });

  it("Deve lançar erro de validação se o campo maxGuests for igual a zero no PropertyEntity", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Casa de Campo";
    propertyEntity.description = "Linda casa de Campo para passear";
    propertyEntity.maxGuests = 0;
    propertyEntity.basePricePerNight = 300;

    expect(() => {
      PropertyMapper.toDomain(propertyEntity);
    }).toThrow("O número máximo de hóspedes deve ser maior que zero");
  });

  it("Deve lançar erro de validação se o campo maxGuests for menor que zero no PropertyEntity", () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = "1";
    propertyEntity.name = "Casa de Campo";
    propertyEntity.description = "Linda casa de Campo para passear";
    propertyEntity.maxGuests = -1;
    propertyEntity.basePricePerNight = 300;

    expect(() => {
      PropertyMapper.toDomain(propertyEntity);
    }).toThrow("O número máximo de hóspedes deve ser maior que zero");
  });

  it("Deve converter Property para PropertyEntity corretamente", () => {
    const property = new Property(
      "1",
      "Casa de Campo",
      "Linda casa de Campo para passear",
      6,
      300
    );

    const propertyEntity = PropertyMapper.toPersistence(property);

    expect(propertyEntity).toBeInstanceOf(PropertyEntity);
    expect(propertyEntity.id).toBe("1");
    expect(propertyEntity.name).toBe("Casa de Campo");
    expect(propertyEntity.description).toBe("Linda casa de Campo para passear");
    expect(propertyEntity.maxGuests).toBe(6);
    expect(propertyEntity.basePricePerNight).toBe(300);
  });
});
