using iot_backend.Configuration;
using iot_backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using iot_backend.Dto;
using Microsoft.AspNetCore.Cors;
using iot_backend.Helpers;

// using iot_backend.MQTT;

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
        public async Task<ActionResult<PaginationOutput<SwitchHistory>>> GetSwitchHistory(DateTime? startDate,
            DateTime? endDate,
            string? filter, int pageNumber = 1, int pageSize = 10)
        {
            var switchHistory = await PaginatedList<SwitchHistory>.CreateAsync(_context.SwitchHistory
                .Where(e => filter == "light" ? e.SwitchType == 1 : filter != "fan" || e.SwitchType == 2)
                .Where(sd => startDate == null || sd.CreationTime >= startDate)
                .Where(ed => endDate == null || ed.CreationTime <= endDate)
                .AsNoTracking().OrderByDescending(u => u.CreationTime), pageNumber, pageSize);
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
                SwitchName = input.SwitchType switch
                {
                    1 => "Light",
                    2 => "Fan",
                    _ => "Unknown"
                }
            };
            _context.SwitchHistory.Add(switchHistory);
            await _context.SaveChangesAsync();
            // await MQTT_Client.Publish_Message(input.SwitchType == 1 ? "light/pub1" : "light/pub2", input.State == true ? "ON" : "OFF");
            return Ok(switchHistory);
        }

        [HttpGet("SensorHistory")]
        public async Task<ActionResult<PaginationOutput<SensorHistory>>> GetSensorHistory(DateTime? startDate,
            DateTime? endDate, int? specifiedTemperature, int? specifiedHumidity, int? specifiedBrightness,
            int? specifiedWindSpeed,
            int pageNumber = 1, int orderBy = 0, bool isAsc = false, int pageSize = 10)
        {
            PaginatedList<SensorHistory> sensorHistory;
            if (isAsc)
            {
                if (orderBy == 0)
                {
                    sensorHistory = await PaginatedList<SensorHistory>.CreateAsync(_context.SensorHistory
                        .Where(e => specifiedTemperature == null || e.Temperature == specifiedTemperature)
                        .Where(e => specifiedHumidity == null || e.Humidity == specifiedHumidity)
                        .Where(e => specifiedBrightness == null || e.Brightness == specifiedBrightness)
                        .Where(e => specifiedWindSpeed == null || e.WindSpeed == specifiedWindSpeed)
                        .Where(sd => startDate == null || sd.CreationTime >= startDate)
                        .Where(ed => endDate == null || ed.CreationTime <= endDate)
                        .AsNoTracking().OrderBy(u => u.CreationTime), pageNumber, pageSize);
                }
                else
                {
                    sensorHistory = await PaginatedList<SensorHistory>.CreateAsync(_context.SensorHistory
                            .Where(e => specifiedTemperature == null || e.Temperature == specifiedTemperature)
                            .Where(e => specifiedHumidity == null || e.Humidity == specifiedHumidity)
                            .Where(e => specifiedBrightness == null || e.Brightness == specifiedBrightness)
                            .Where(e => specifiedWindSpeed == null || e.WindSpeed == specifiedWindSpeed)
                            .Where(sd => startDate == null || sd.CreationTime >= startDate)
                            .Where(ed => endDate == null || ed.CreationTime <= endDate)
                            .AsNoTracking().OrderBy(u =>
                                orderBy == 1 ? u.Temperature : orderBy == 2 ? u.Humidity : u.Brightness),
                        pageNumber, pageSize);
                }
            }
            else
            {
                if (orderBy == 0)
                {
                    sensorHistory = await PaginatedList<SensorHistory>.CreateAsync(_context.SensorHistory
                        .Where(e => specifiedTemperature == null || e.Temperature == specifiedTemperature)
                        .Where(e => specifiedHumidity == null || e.Humidity == specifiedHumidity)
                        .Where(e => specifiedBrightness == null || e.Brightness == specifiedBrightness)
                        .Where(e => specifiedWindSpeed == null || e.WindSpeed == specifiedWindSpeed)
                        .Where(sd => startDate == null || sd.CreationTime >= startDate)
                        .Where(ed => endDate == null || ed.CreationTime <= endDate)
                        .AsNoTracking().OrderByDescending(u => u.CreationTime), pageNumber, pageSize);
                }
                else
                {
                    sensorHistory = await PaginatedList<SensorHistory>.CreateAsync(_context.SensorHistory
                            .Where(e => specifiedTemperature == null || e.Temperature == specifiedTemperature)
                            .Where(e => specifiedHumidity == null || e.Humidity == specifiedHumidity)
                            .Where(e => specifiedBrightness == null || e.Brightness == specifiedBrightness)
                            .Where(e => specifiedWindSpeed == null || e.WindSpeed == specifiedWindSpeed)
                            .Where(sd => startDate == null || sd.CreationTime >= startDate)
                            .Where(ed => endDate == null || ed.CreationTime <= endDate)
                            .AsNoTracking().OrderByDescending(u =>
                                orderBy == 1 ? u.Temperature :
                                orderBy == 2 ? u.Humidity :
                                orderBy == 3 ? u.Brightness : u.WindSpeed),
                        pageNumber,
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
                Brightness = input.Brightness,
                WindSpeed = input.WindSpeed,
                CreationTime = input.CreationTime
            };
            _context.SensorHistory.Add(sensorHistory);
            await _context.SaveChangesAsync();
            return Ok(sensorHistory);
        }
    }
}