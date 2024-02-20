using iot_backend.Configuration;
using iot_backend.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using iot_backend.Dto;
using Microsoft.AspNetCore.Cors;
using iot_backend.Helpers;
using System.Linq.Dynamic;
using iot_backend.MQTT;

namespace iot_backend.Controllers
{
    [EnableCors]
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly DataContext _context;

        public DashboardController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("SwitchHistory")]
        public async Task<ActionResult<PaginationOutput<SwitchHistory>>> GetSwitchHistory(int? pageNumber,
            string? filter)
        {
            const int pageSize = 10;
            var switchHistory = await PaginatedList<SwitchHistory>.CreateAsync(_context.SwitchHistory
                .Where(e => filter == "light" ? e.SwitchType == 1 : filter == "fan" ? e.SwitchType == 2 : true)
                .AsNoTracking().OrderByDescending(u => u.CreationTime), pageNumber ?? 1, pageSize);
            PaginationOutput<SwitchHistory> output = new PaginationOutput<SwitchHistory>
            {
                currentPage = switchHistory.PageIndex,
                totalPages = switchHistory.TotalPages,
                totalItems = switchHistory.TotalItems,
                items = switchHistory
            };
            return Ok(output);
        }

        [HttpPost("SwitchChange")]
        public async Task<ActionResult<SwitchHistory>> SwitchChange(SwitchChangeInput input)
        {
            var switchHistory = new SwitchHistory
            {
                State = input.State,
                SwitchType = input.SwitchType,
                SwitchName = input.SwitchType == 1 ? "Light" : input.SwitchType == 2 ? "Fan" : "Unknown"
            };
            _context.SwitchHistory.Add(switchHistory);
            await _context.SaveChangesAsync();
            await MQTT_Client.Publish_Message(input.SwitchType == 1 ? "light" : "fan", input.State == true ? "ON" : "OFF");
            return Ok(switchHistory);
        }

        [HttpGet("SensorHistory")]
        public async Task<ActionResult<PaginationOutput<SensorHistory>>> GetSensorHistory(int? pageNumber,
            int orderBy = 0, bool isAsc = false)
        {
            const int pageSize = 10;
            PaginatedList<SensorHistory> sensorHistory;
            if (isAsc)
            {
                if (orderBy == 0)
                {
                    sensorHistory = await PaginatedList<SensorHistory>.CreateAsync(_context.SensorHistory.AsNoTracking()
                        .OrderBy(u => u.CreationTime), pageNumber ?? 1, pageSize);
                }
                else
                {
                    sensorHistory = await PaginatedList<SensorHistory>.CreateAsync(_context.SensorHistory.AsNoTracking()
                            .OrderBy(u => orderBy == 1 ? u.Temperature : orderBy == 2 ? u.Humidity : u.Brightness),
                        pageNumber ?? 1, pageSize);
                }
            }
            else
            {
                if (orderBy == 0)
                {
                    sensorHistory = await PaginatedList<SensorHistory>.CreateAsync(_context.SensorHistory.AsNoTracking()
                        .OrderByDescending(u => u.CreationTime), pageNumber ?? 1, pageSize);
                }
                else
                {
                    sensorHistory = await PaginatedList<SensorHistory>.CreateAsync(_context.SensorHistory.AsNoTracking()
                            .OrderByDescending(u =>
                                orderBy == 1 ? u.Temperature : orderBy == 2 ? u.Humidity : u.Brightness),
                        pageNumber ?? 1,
                        pageSize);
                }
            }

            PaginationOutput<SensorHistory> output = new PaginationOutput<SensorHistory>
            {
                currentPage = sensorHistory.PageIndex,
                totalPages = sensorHistory.TotalPages,
                totalItems = sensorHistory.TotalItems,
                items = sensorHistory
            };
            return Ok(output);
        }

        [HttpPost("SensorChange")]
        public async Task<ActionResult<SensorHistory>> SensorChange(SensorHistory input)
        {
            var sensorHistory = new SensorHistory
            {
                Temperature = input.Temperature,
                Humidity = input.Humidity,
                Brightness = input.Brightness
            };
            _context.SensorHistory.Add(sensorHistory);
            await _context.SaveChangesAsync();
            return Ok(sensorHistory);
        }
    }
}