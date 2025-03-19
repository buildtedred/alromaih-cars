import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash2, X } from 'lucide-react'
import React from 'react'

const EditeSpecifications = ({
    removeSpecification,
    removeSpecDetail,
    addSpecDetail,
    addSpecification,
    handleSpecDetailChange,
    handleSpecTitleChange,
    specifications,
}) => {
  return (
    <div className='border border-gray-200 rounded-md mt-4 p-1'>
    <div className="flex items-center justify-between mb-4 ">
      <h2 className="text-2xl font-bold">Product Specifications</h2>
      <Button
        onClick={addSpecification}
        className="gap-1 border border-gray-200"
      >
        <Plus className="h-4 w-4" />
        <span>Add Category</span>
      </Button>
    </div>

    <Separator className="mb-6" />

    <div className="space-y-6 shadow-lg  h-[40vh] overflow-y-scroll">
      {specifications.map((category, catIndex) => (
        <div
          key={catIndex}
          className="border border-gray-200 rounded-md p-6 "
        >
          <div className="flex items-center justify-between mb-4">
            <Input
              className="max-w-full"
              placeholder="Category Title"
              value={category.title}
              onChange={(e) =>
                handleSpecTitleChange(catIndex, e.target.value)
              }
              required
            />
            <Button
              onClick={() => removeSpecification(catIndex)}
              variant="destructive"
              size="icon"
              className="ml-2 bg-red-500 hover:bg-red-600"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Remove category</span>
            </Button>
          </div>

          <div className="space-y-3">
            {category.details.map((detail, detailIndex) => (
              <div
                key={detailIndex}
                className="flex items-center gap-3"
              >
                <Input
                  placeholder="Label"
                  value={detail.label}
                  onChange={(e) =>
                    handleSpecDetailChange(
                      catIndex,
                      detailIndex,
                      "label",
                      e.target.value
                    )
                  }
                  required
                  className="flex-1"
                />
                <Input
                  placeholder="Value"
                  value={detail.value}
                  onChange={(e) =>
                    handleSpecDetailChange(
                      catIndex,
                      detailIndex,
                      "value",
                      e.target.value
                    )
                  }
                  required
                  className="flex-1"
                />
                <Button
                  onClick={() =>
                    removeSpecDetail(catIndex, detailIndex)
                  }
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Remove detail</span>
                </Button>
              </div>
            ))}

            <Button
              onClick={() => addSpecDetail(catIndex)}
              variant="outline"
              className="w-full mt-2 border-dashed"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Detail</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default EditeSpecifications