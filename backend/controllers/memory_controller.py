from services.memory import MemoryService

class MemoryController: 
    @staticmethod
    def get_memory_by_id(id):
        return MemoryService.get_memory_by_id(id=id)