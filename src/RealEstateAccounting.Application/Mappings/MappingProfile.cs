using AutoMapper;
using RealEstateAccounting.Application.DTOs;
using RealEstateAccounting.Domain.Entities;
using RealEstateAccounting.Domain.Enums;

namespace RealEstateAccounting.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Apartment mappings
        CreateMap<Apartment, ApartmentDto>();
        CreateMap<CreateApartmentDto, Apartment>()
            .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.Area * src.PricePerSquareMeter))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ApartmentStatus.Available));
        CreateMap<UpdateApartmentDto, Apartment>();

        // Customer mappings
        CreateMap<Customer, CustomerDto>();
        CreateMap<CreateCustomerDto, Customer>();
        CreateMap<UpdateCustomerDto, Customer>();

        // Agent mappings
        CreateMap<Agent, AgentDto>();
        CreateMap<CreateAgentDto, Agent>()
            .ForMember(dest => dest.TotalCommissionEarned, opt => opt.MapFrom(src => 0))
            .ForMember(dest => dest.TotalSales, opt => opt.MapFrom(src => 0));
        CreateMap<UpdateAgentDto, Agent>();

        CreateMap<Agent, AgentPerformanceDto>()
            .ForMember(dest => dest.AgentId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.AgentName, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.TotalCommission, opt => opt.MapFrom(src => src.TotalCommissionEarned))
            .ForMember(dest => dest.TotalRevenue, opt => opt.Ignore());

        // Contract mappings
        CreateMap<Contract, ContractDto>()
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.FullName : string.Empty))
            .ForMember(dest => dest.ApartmentInfo, opt => opt.MapFrom(src => src.Apartment != null
                ? $"№ {src.Apartment.ApartmentNumber}, Блок {src.Apartment.Block}, Подъезд {src.Apartment.Entrance}, Этаж {src.Apartment.Floor}, {src.Apartment.RoomCount} комн."
                : string.Empty))
            .ForMember(dest => dest.AgentName, opt => opt.MapFrom(src => src.Agent != null ? src.Agent.FullName : string.Empty))
            .ForMember(dest => dest.RemainingBalance, opt => opt.MapFrom(src => src.RemainingBalance))
            .ForMember(dest => dest.MonthsPaid, opt => opt.MapFrom(src => src.MonthsPaid))
            .ForMember(dest => dest.MonthsRemaining, opt => opt.MapFrom(src => src.MonthsRemaining));

        CreateMap<Contract, ContractDetailsDto>()
            .IncludeBase<Contract, ContractDto>();

        CreateMap<CreateContractDto, Contract>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => ContractStatus.Active));

        CreateMap<UpdateContractDto, Contract>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // Payment mappings
        CreateMap<Payment, PaymentDto>()
            .ForMember(dest => dest.ContractNumber, opt => opt.MapFrom(src => src.Contract != null ? src.Contract.ContractNumber : string.Empty))
            .ForMember(dest => dest.RecordedByUserName, opt => opt.MapFrom(src => src.RecordedByUserId));
        CreateMap<CreatePaymentDto, Payment>()
            .ForMember(dest => dest.IsPaid, opt => opt.MapFrom(src => true));

        // InstallmentPlan mappings
        CreateMap<InstallmentPlan, InstallmentPlanDto>()
            .ForMember(dest => dest.IsOverdue, opt => opt.MapFrom(src => src.IsOverdue));
    }
}
