package io.dexb.models;

public class Sprint {

	private String name;

	private Integer planned;

	private Integer done;

	private Integer added;

	private Integer removed;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getPlanned() {
		return planned;
	}

	public void setPlanned(Integer planned) {
		this.planned = planned;
	}

	public Integer getDone() {
		return done;
	}

	public void setDone(Integer done) {
		this.done = done;
	}

	public Integer getAdded() {
		return added;
	}

	public void setAdded(Integer added) {
		this.added = added;
	}

	public Integer getRemoved() {
		return removed;
	}

	public void setRemoved(Integer removed) {
		this.removed = removed;
	}
}
