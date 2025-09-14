import { PropertyService } from "../../application/services/property_service";
import { CreatePropertyDTO } from "../../application/dtos/create_property_dto";
import { Request, Response } from "express";

export class PropertyController {
  private propertyService: PropertyService;

  constructor(propertyService: PropertyService) {
    this.propertyService = propertyService;
  }

  async createProperty(req: Request, res: Response): Promise<Response> {
    try {
      const dto: CreatePropertyDTO = {
        name: req.body.name,
        description: req.body.description,
        maxGuests: req.body.maxGuests,
        basePricePerNight: req.body.basePricePerNight,
      };
      const property = await this.propertyService.createProperty(dto);
      return res.status(201).json({
        message: "Property created successfully",
        property: {
          id: property.getId(),
          name: property.getName(),
          description: property.getDescription(),
          maxGuests: property.getMaxGuests(),
          basePricePerNight: property.getBasePricePerNight(),
        },
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "An unexpected error occured" });
    }
  }
}
