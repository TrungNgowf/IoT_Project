using System.Globalization;
using iot_backend.Configuration;
using iot_backend.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using iot_backend.Dto;
using Microsoft.AspNetCore.Cors;
using iot_backend.Helpers;
using Microsoft.Data.SqlClient;

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
        public async Task<ActionResult<PaginationOutput<SwitchHistory>>> GetSwitchHistory(String? searchDate,
            string? filter, int pageNumber = 1, int pageSize = 10)
        {
            PaginatedList<SwitchHistory> switchHistory;
            var sqlQuerry = "SELECT * FROM SwitchHistory where 1=1";
            if (searchDate != null)
            {
                sqlQuerry += $" and convert(varchar(25), CreationTime, 120) like '{ConvertStringToDate(searchDate)}%'";
            }
            if(!string.IsNullOrEmpty(filter) && filter != "all")
            {
                sqlQuerry += $" and SwitchType = {(filter == "light" ? 1 : 2)}";
            }
            sqlQuerry += " ORDER BY CreationTime DESC";
            sqlQuerry += " OFFSET 0 ROWS";
            switchHistory = await PaginatedList<SwitchHistory>.CreateAsync(
                _context.SwitchHistory.FromSqlRaw<SwitchHistory>(sqlQuerry),
                pageNumber, pageSize);
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

        private string ConvertStringToDate(string inputDate)
        {
            try
            {
                // Define the expected format for the input string
                string format = inputDate.Length <= 10 ? "dd/MM/yyyy" :
                    inputDate.Length <= 13 ? "dd/MM/yyyy HH" :
                    inputDate.Length <= 16 ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy HH:mm:ss";

                // Parse the string to a DateTime object
                DateTime parsedDate = DateTime.ParseExact(inputDate, format, CultureInfo.InvariantCulture);

                // Return the formatted date string in yyyy-MM-dd HH:mm:ss format
                return parsedDate.ToString(inputDate.Length <= 10 ? "yyyy-MM-dd" :
                    inputDate.Length <= 13 ? "yyyy-MM-dd HH" :
                    inputDate.Length <= 16 ? "yyyy-MM-dd HH:mm" : "yyyy-MM-dd HH:mm:ss");
            }
            catch (FormatException)
            {
                // Handle cases where the input string doesn't match the format
                return "Invalid Date Format";
            }
        }

        [HttpGet("SensorHistory")]
        public async Task<ActionResult<PaginationOutput<SensorHistory>>> GetSensorHistory(String? searchDate,
            int? specifiedTemperature, int? specifiedHumidity, int? specifiedBrightness,
            int? specifiedWindSpeed,
            int pageNumber = 1, int orderBy = 0, bool isAsc = false, int pageSize = 10)
        {
            PaginatedList<SensorHistory> sensorHistory;
            var sqlQuerry = "SELECT * FROM SensorHistory where 1=1";
            if (searchDate != null)
            {
                sqlQuerry += $" and convert(varchar(25), CreationTime, 120) like '{ConvertStringToDate(searchDate)}%'";
            }

            if (specifiedTemperature != null)
            {
                sqlQuerry += $" and Temperature = {specifiedTemperature}";
            }

            if (specifiedHumidity != null)
            {
                sqlQuerry += $" and Humidity = {specifiedHumidity}";
            }

            if (specifiedBrightness != null)
            {
                sqlQuerry += $" and Brightness = {specifiedBrightness}";
            }

            if (specifiedWindSpeed != null)
            {
                sqlQuerry += $" and WindSpeed = {specifiedWindSpeed}";
            }

            sqlQuerry +=
                $" ORDER BY {(orderBy == 0 ? "CreationTime" : orderBy == 1 ? "Temperature" : orderBy == 2 ? "Humidity" : orderBy == 3 ? "Brightness" : "WindSpeed")}";
            sqlQuerry += isAsc ? " ASC" : " DESC";
            sqlQuerry += " OFFSET 0 ROWS";

            sensorHistory = await PaginatedList<SensorHistory>.CreateAsync(
                _context.SensorHistory.FromSqlRaw<SensorHistory>(sqlQuerry),
                pageNumber, pageSize);
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