using Microsoft.AspNetCore.Identity;

namespace OLProject.Models;

public class Parcel
{
    public int Id { get; set; }
    public string Province { get; set; }
    public string District { get; set; }
    public string Neighborhood { get; set; }

}
