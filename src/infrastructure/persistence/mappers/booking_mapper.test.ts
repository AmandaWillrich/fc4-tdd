import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { BookingEntity } from "../entities/booking_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "../mappers/booking_mapper";
import { DateRange } from "../../../domain/value_objects/date_range";
import { UserMapper } from "./user_mapper";
import { PropertyMapper } from "./property_mapper";
import { User } from "../../../domain/entities/user";

describe("Booking Mapper", () => {
  it("Deve converter BookingEntity em Booking corretamente", () => {
    const startDate = new Date("2025-09-01");
    const endDate = new Date("2025-09-05");

    const guest = new UserEntity();
    guest.id = "1";
    guest.name = "Amanda";

    const bookingEntity = new BookingEntity();
    bookingEntity.id = "1";
    bookingEntity.guest = guest;
    bookingEntity.startDate = startDate;
    bookingEntity.endDate = endDate;
    bookingEntity.guestCount = 3;
    bookingEntity.totalPrice = 1500;
    bookingEntity.status = "CONFIRMED";

    const property = new Property(
      "1",
      "Casa de Campo",
      "Casa com linda vista",
      6,
      300
    );

    const mockedUser = {} as any;

    const spyUserMapperToDomain = jest
      .spyOn(UserMapper, "toDomain")
      .mockReturnValue(mockedUser);
    const spyPropertyMapperToDomain = jest.spyOn(PropertyMapper, "toDomain");

    const booking = BookingMapper.toDomain(bookingEntity, property);

    expect(spyUserMapperToDomain).toHaveBeenCalledWith(guest);
    expect(spyPropertyMapperToDomain).not.toHaveBeenCalled();
    expect(booking).toBeInstanceOf(Booking);
    expect(booking.getId()).toBe("1");
    expect(booking.getProperty()).toBe(property);
    expect(booking.getGuest()).toBe(mockedUser);
    expect(booking.getDateRange()).toBeInstanceOf(DateRange);
    expect(booking.getDateRange().getStartDate()).toBe(startDate);
    expect(booking.getDateRange().getEndDate()).toBe(endDate);
    expect(booking.getGuestCount()).toBe(3);
    expect(booking.getTotalPrice()).toBe(1500);
    expect(booking.getStatus()).toBe("CONFIRMED");

    spyUserMapperToDomain.mockRestore();
    spyPropertyMapperToDomain.mockRestore();
  });

  it("Deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity", () => {
    const startDate = new Date("2025-09-01");
    const endDate = new Date("2025-09-05");

    const guest = new UserEntity();
    guest.id = "1";
    guest.name = "Amanda";

    const bookingEntity = new BookingEntity();
    bookingEntity.id = "1";
    bookingEntity.guest = guest;
    bookingEntity.startDate = startDate;
    bookingEntity.endDate = endDate;
    bookingEntity.guestCount = 0;
    bookingEntity.totalPrice = 1500;
    bookingEntity.status = "CONFIRMED";

    const property = new Property(
      "1",
      "Casa de Campo",
      "Casa com linda vista",
      6,
      300
    );

    expect(() => {
      BookingMapper.toDomain(bookingEntity, property);
    }).toThrow("O número de hóspedes deve ser maior que zero.");
  });

  it("Deve converter Booking para BookingEntity corretamente", () => {
    const startDate = new Date("2025-09-01");
    const endDate = new Date("2025-09-05");
    const dateRange = new DateRange(startDate, endDate);

    const guest = new User("1", "Amanda");
    const property = new Property(
      "1",
      "Casa de Campo",
      "Linda casa de Campo para passear",
      6,
      300
    );

    const mockedUser = {} as any;
    const mockedProperty = {} as any;

    const spyUserMapperToDomain = jest
      .spyOn(UserMapper, "toPersistence")
      .mockReturnValue(mockedUser);
    const spyPropertyMapperToDomain = jest
      .spyOn(PropertyMapper, "toPersistence")
      .mockReturnValue(mockedProperty);

    const booking = new Booking("1", property, guest, dateRange, 5);

    const bookingEntity = BookingMapper.toPersistence(booking);

    expect(spyUserMapperToDomain).toHaveBeenCalledWith(guest);
    expect(spyPropertyMapperToDomain).toHaveBeenCalledWith(property);

    expect(bookingEntity).toBeInstanceOf(BookingEntity);
    expect(bookingEntity.id).toBe(booking.getId());
    expect(bookingEntity.property).toBe(mockedProperty);
    expect(bookingEntity.guest).toBe(mockedUser);
    expect(bookingEntity.startDate).toBe(dateRange.getStartDate());
    expect(bookingEntity.endDate).toBe(dateRange.getEndDate());
    expect(bookingEntity.guestCount).toBe(booking.getGuestCount());
    expect(bookingEntity.totalPrice).toBe(booking.getTotalPrice());
    expect(bookingEntity.status).toBe(booking.getStatus());

    spyUserMapperToDomain.mockRestore();
    spyPropertyMapperToDomain.mockRestore();
  });
});
