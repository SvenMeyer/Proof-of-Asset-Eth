pragma solidity ^0.5.0;

contract ProofOfAsset {

	// basic test variable

	uint256 private value;

	// Emitted when the stored value changes
	event ValueChanged(uint256 newValue);

	// Stores a new value in the contract
	function store(uint256 newValue) public {
			value = newValue;
			emit ValueChanged(newValue);
	}

	// Reads the last stored value
	function retrieve() public view returns (uint256) {
			return value;
	}

	// real contract starts here --------------------------------------------------

	uint public taskCount = 0;

	// datatype for tasks
	struct Task {
		uint id;
		string content;
		bool completed;
	}

	mapping (uint => Task) public tasks;

	event TaskCreated(
		uint id,
		string content,
		bool completed
	);

	event TaskCompleted(
		uint id,
		bool completed
	);

	constructor() public {
		createTask("Task 1");
		createTask("Task 2");
	}

	function createTask(string memory _content) public {
		tasks[taskCount] = Task(taskCount, _content, false);
		taskCount++;
		emit TaskCreated(taskCount-1, _content, false);
	}

	function toggleCompleted(uint _id) public {
		Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
		emit TaskCompleted(_id, _task.completed);
	}
}