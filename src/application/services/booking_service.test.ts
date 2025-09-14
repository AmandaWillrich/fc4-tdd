import { Booking } from "../../domain/entities/booking";
import { BookingService } from "../../application/services/booking_service";
import { PropertyService } from "../../application/services/property_service";
import { UserService } from "../../application/services/user_service";
import { CreateBookingDTO } from "../../application/dtos/create_booking_dto";
import { FakeBookingRepository } from "../../infrastructure/repositories/fake_booking_repository";

jest.mock("./property_service");
jest.mock("./user_service");

describe("BookingService", () => {
  let bookingService: BookingService;
  let fakeBookingRepository: FakeBookingRepository;
  let mockPropertyService: jest.Mocked<PropertyService>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    const mockPropertyRepositoy = {} as any;
    const mockUserRepositoy = {} as any;

    mockPropertyService = new PropertyService(
      mockPropertyRepositoy
    ) as jest.Mocked<PropertyService>;

    mockUserService = new UserService(
      mockUserRepositoy
    ) as jest.Mocked<UserService>;

    fakeBookingRepository = new FakeBookingRepository();

    bookingService = new BookingService(
      fakeBookingRepository,
      mockPropertyService,
      mockUserService
    );
  });

  it("deve criar uma reserva com sucesso usando respositorio fake", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-20"),
      endDate: new Date("2024-12-25"),
      guestCount: 2,
    };

    const result = await bookingService.createBooking(bookingDTO);

    expect(result).toBeInstanceOf(Booking);
    expect(result.getStatus()).toBe("CONFIRMED");
    expect(result.getTotalPrice()).toBe(500);

    const savedBooking = await fakeBookingRepository.findById(result.getId());
    expect(savedBooking).not.toBeNull();
    expect(savedBooking?.getId()).toBe(result.getId());
  });

  it("deve lançar um erro quando a propriedade não for encontrada", async () => {
    mockPropertyService.findPropertyById.mockResolvedValue(null);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-20"),
      endDate: new Date("2024-12-25"),
      guestCount: 2,
    };

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Propriedade não encontrada."
    );
  });

  it("deve lançar um erro quando o usuário não for encontrado", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(null);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-20"),
      endDate: new Date("2024-12-25"),
      guestCount: 2,
    };

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Usuário não encontrado."
    );
  });

  it("deve lançar um erro ao tentar criar reserva para um período já reservado", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-20"),
      endDate: new Date("2024-12-25"),
      guestCount: 2,
    };

    const result = await bookingService.createBooking(bookingDTO);

    mockProperty.isAvailable.mockReturnValue(false);
    mockProperty.addBooking.mockImplementationOnce(() => {
      throw new Error(
        "A propriedade não está disponível para o período selecionado."
      );
    });

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "A propriedade não está disponível para o período selecionado."
    );
  });

  it("deve cancelar uma reserva existente usando o repositório fake", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2024-12-20"),
      endDate: new Date("2024-12-25"),
      guestCount: 2,
    };

    const booking = await bookingService.createBooking(bookingDTO);

    const spyFindById = jest.spyOn(fakeBookingRepository, "findById");

    await bookingService.cancelBooking(booking.getId());

    const canceledBooking = await fakeBookingRepository.findById(
      booking.getId()
    );

    expect(canceledBooking?.getStatus()).toBe("CANCELLED");
    expect(spyFindById).toHaveBeenCalledWith(booking.getId());
    expect(spyFindById).toHaveBeenCalledTimes(2);
    spyFindById.mockRestore();
  });

  it("Deve retornar erro ao tentar cancelar uma reserva que não existe", async () => {
    await expect(bookingService.cancelBooking("42")).rejects.toThrow(
      "Reserva não encontrada."
    );
  });
});
