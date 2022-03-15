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

    [HttpGet()]
    public async Task<ActionResult<List<Project>>> GetProjects(int? page, int? limit) 
    {   
        try
        {   

            var data = await(_projectService.getAllProjects(page, limit));
            if (data == null) return NotFound(data);

            return Ok(data);
        }
        catch (System.Exception)
        {
            return StatusCode(500);
        }
    }

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
    public async Task<ActionResult<bool>> stopTimer([FromBody]Project project)
    {
        try
        {
            if (project.name != null) {
                var data = await _projectService.stopTimer(project.name);
                if (data == false) return Conflict(data);
                return Ok(data);
            } else {
                return BadRequest(false);
            }

        }
        catch (System.Exception)
        {
            return StatusCode(500);
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<bool>> put(long id, [FromBody]Project project) 
    {
        try
        {   
            if (project.name != null) {
                var data = await _projectService.edit(id, project.name);
                if (data == false) return Conflict(data);
                return Ok(data);
            } else {
                return BadRequest(false);
            }
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

    [HttpPost("delete_all")]
    public async Task<ActionResult<bool>> deleteAll(long id)
    {
        try
        {
            var data = await _projectService.deleteAll();
            if (data == false) return Conflict(data);

            return Ok(data);
        }
        catch (System.Exception)
        {
            return StatusCode(500);
        }
    }
}
