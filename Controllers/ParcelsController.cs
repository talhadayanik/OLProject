using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OLProject.Data;
using OLProject.Models;

namespace OLProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParcelsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public ParcelsController(MyDbContext context)
        {
            _context = context;
        }

        // GET: api/Parcels
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Parcel>>> GetParcels()
        {
          if (_context.Parcels == null)
          {
              return NotFound();
          }
            return await _context.Parcels.ToListAsync();
        }

        // GET: api/Parcels/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Parcel>> GetParcel(int id)
        {
          if (_context.Parcels == null)
          {
              return NotFound();
          }
            var parcel = await _context.Parcels.FindAsync(id);

            if (parcel == null)
            {
                return NotFound();
            }

            return parcel;
        }

        // PUT: api/Parcels/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParcel(int id, Parcel parcel)
        {
            if (id != parcel.Id)
            {
                return BadRequest();
            }

            _context.Entry(parcel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParcelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Parcels
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Parcel>> PostParcel(Parcel parcel)
        {
          if (_context.Parcels == null)
          {
              return Problem("Entity set 'MyDbContext.Parcels'  is null.");
          }
            _context.Parcels.Add(parcel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetParcel", new { id = parcel.Id }, parcel);
        }

        // DELETE: api/Parcels/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParcel(int id)
        {
            if (_context.Parcels == null)
            {
                return NotFound();
            }
            var parcel = await _context.Parcels.FindAsync(id);
            if (parcel == null)
            {
                return NotFound();
            }

            _context.Parcels.Remove(parcel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ParcelExists(int id)
        {
            return (_context.Parcels?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
