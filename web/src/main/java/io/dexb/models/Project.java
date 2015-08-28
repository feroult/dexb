package io.dexb.models;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;
import io.yawp.repository.annotations.Index;
import io.yawp.repository.annotations.Json;

import java.util.List;

@Endpoint(path = "/projects")
public class Project {

	@Id
	private IdRef<Project> id;

	@Index
	private String name;

	private String spreadsheet;

	private Integer points;

	private Integer lastSprint;

	private Integer mvpSprint;

	@Json
	private List<Sprint> sprints;

	public IdRef<Project> getId() {
		return id;
	}

	public void setId(IdRef<Project> id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSpreadsheet() {
		return spreadsheet;
	}

	public void setSpreadsheet(String spreadsheet) {
		this.spreadsheet = spreadsheet;
	}

	public Integer getPoints() {
		return points;
	}

	public void setPoints(Integer points) {
		this.points = points;
	}

	public Integer getLastSprint() {
		return lastSprint;
	}

	public void setLastSprint(Integer lastSprint) {
		this.lastSprint = lastSprint;
	}

	public Integer getMvpSprint() {
		return mvpSprint;
	}

	public void setMvpSprint(Integer mvpSprint) {
		this.mvpSprint = mvpSprint;
	}

	public List<Sprint> getSprints() {
		return sprints;
	}

	public void setSprints(List<Sprint> sprints) {
		this.sprints = sprints;
	}
}
