import React from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const AddSpecifications = ({
  addSpecDetail,
  handleSpecTitleChange,
  handleSpecDetailChange,
  removeSpecDetail,
  category,
  addSpecification,
  specifications,
  removeSpecification,
}) => {
  return (
    <div className="space-y-6 mt-4 shadow-lg border border-gray-200 rounded-md mt-4 p-1">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Product Specifications</h3>
        <Button
          onClick={addSpecification}
          size="sm"
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Button>
      </div>

      <Separator />

      {specifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground ">
          <Badge variant="outline" className="mb-2">
            No specifications yet
          </Badge>
          <p>Add a specification category to get started</p>
        </div>
      ) : (
        <div className=" shadow-lg  h-[40vh] overflow-y-scroll">
          {specifications.map((category, catIndex) => (
            <Card key={catIndex} className="overflow-hidden">
              <div className="bg-muted p-4 flex items-center justify-between">
                <Input
                  className="max-w-[70%] bg-background"
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
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove category</span>
                </Button>
              </div>

              <CardContent className="p-4 space-y-3">
                {category.details.map((detail, detailIndex) => (
                  <div
                    key={detailIndex}
                    className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center"
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
                    />
                    <Button
                      onClick={() => removeSpecDetail(catIndex, detailIndex)}
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove detail</span>
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={() => addSpecDetail(catIndex)}
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Detail</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddSpecifications;
