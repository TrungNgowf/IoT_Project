using iot_backend.Configuration;
using iot_backend.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using iot_backend.Dto;
using Microsoft.AspNetCore.Cors;
using iot_backend.Helpers;

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
        public async Task<ActionResult<PaginationOutput<SwitchHistory>>> GetSwitchHistory(int? pageNumber)
        {
            const int pageSize = 10;
            var switchHistory = await PaginatedList<SwitchHistory>.CreateAsync(_context.SwitchHistory.AsNoTracking().OrderByDescending(u => u.CreationTime), pageNumber ?? 1, pageSize);
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
            return Ok(switchHistory);
        }

        [HttpGet("SensorHistory")]
        public async Task<ActionResult<PaginationOutput<SensorHistory>>> GetSensorHistory(int? pageNumber)
        {
            const int pageSize = 10;
            var sensorHistory = await PaginatedList<SensorHistory>.CreateAsync(_context.SensorHistory.AsNoTracking().OrderByDescending(u => u.CreationTime), pageNumber ?? 1, pageSize);
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
