using Microsoft.AspNetCore.Mvc;
using timely.Models;
using timely.Services;
namespace timely.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectController : ControllerBase
{
    private IProjectService _projectService;
    public ProjectController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet] 
    public async Task<ActionResult<List<Project>>> Get() 
    {
        try
        {
            var data = await(_projectService.GetAllProjects());
            if (data == null) return NotFound(data);

            return Ok(data);
        }
        catch (System.Exception)
        {
            return StatusCode(500);
        }
    }
    
    // GET api/project i ono ?page i ?limit

    [HttpPost("start")]
    public async Task<ActionResult<bool>> startTimer()
    {   
        try
        {
            var data = await _projectService.startTimer();
            if (data == false) return Conflict(data);

            return Ok(data);
        }
        catch (System.Exception)
        {
            return StatusCode(500);
        }
    }

    [HttpPost("stop")]
    public async Task<ActionResult<bool>> stopTimer([FromBody]string name)
    {
        try
        {
            var data = await _projectService.stopTimer(name);
            if (data == false) return Conflict(data);

            return Ok(data);
        }
        catch (System.Exception)
        {
            return StatusCode(500);
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<bool>> put(long id, [FromBody]string name) 
    {
        try
        {
            var data = await _projectService.edit(id, name);
            if (data == false) return Conflict(data);

            return Ok(data);
        }
        catch (System.Exception)
        {
            return StatusCode(500);
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> delete(long id)
    {
        try
        {
            var data = await _projectService.delete(id);
            if (data == false) return Conflict(data);

            return Ok(data);
        }
        catch (System.Exception)
        {
            return StatusCode(500);
        }
    }
}
