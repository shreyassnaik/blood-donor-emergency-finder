from fastapi import APIRouter
from ..database import execute_query

router = APIRouter()

@router.get("/")
async def get_stats():
    # Total Donors
    donors_res = execute_query("SELECT COUNT(*) as count FROM donors", fetch=True)
    total_donors = donors_res[0]["count"] if donors_res else 0

    # Lives Saved (approximated as 3x fulfilled requests units, or just 3x total donors for demo)
    requests_res = execute_query("SELECT SUM(units) as total_units FROM blood_requests WHERE status = 'fulfilled'", fetch=True)
    total_units = requests_res[0]["total_units"] if requests_res and requests_res[0]["total_units"] else 0
    lives_saved = int(total_units) * 3 if total_units > 0 else (total_donors * 3)

    # Cities Covered
    cities_res = execute_query("SELECT COUNT(DISTINCT city) as count FROM donors", fetch=True)
    cities_covered = cities_res[0]["count"] if cities_res else 0
    
    # Fix cities covered to minimum 48+ for marketing on landing page if database is empty/small
    display_cities = "48+" if cities_covered < 48 else str(cities_covered)

    return {
        "totalDonors": total_donors,
        "livesSaved": lives_saved,
        "citiesCovered": display_cities,
        "avgResponseTime": "4.2 min" # Hardcoded static metric for now
    }
