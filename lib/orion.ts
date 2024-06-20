type OrionStore = {
    [key: string]: string;
  };
  
  class OrionMock {
    private store: OrionStore = {};
  
    set(key: string, value: string): string {
      this.store[key] = value;
      return "OK";
    }
  
    get(key: string): string {
      return this.store[key] || "(nil)";
    }
  
    execute(command: string): string {
      const [cmd, ...args] = command.split(" ");
      switch (cmd.toUpperCase()) {
        case "SET":
          if (args.length !== 2) return "ERR wrong number of arguments for 'set' command";
          return this.set(args[0], args[1]);
        case "GET":
          if (args.length !== 1) return "ERR wrong number of arguments for 'get' command";
          return this.get(args[0]);
        default:
          return `ERR unknown command '${cmd}'`;
      }
    }
  }
  
  export default OrionMock;
  